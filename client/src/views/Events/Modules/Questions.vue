<template>
	<div class="w-full mt-8">
        <template v-if="!loaded" />
        <List v-else :elements="questions" @sorted="onSorted">
            <section slot="header">
                <div class="w-full flex flex-wrap justify-between mb-3 align-items-baseline">
                    <button class="btn" :class="pollIsLive ? 'btn-red': 'btn-green'" @click="toggleQuizz" v-if="!toggleInProgress">{{pollIsLive ? 'Stop quizz': 'Start quizz'}}</button>
                    <button v-else class="btn" disabled>Working...</button>
                </div>
            </section>
            <template v-slot:list="{ elements, searchQuery }">
                <Question v-for="question in elements" :key="question.id" :question="question" :searchQuery="searchQuery" :inQuizz="quizz.includes(question.id)"
                    @select="(question) => $store.commit('questions/setSelectedQuestionId', question.id)"
                    @add="(question) => quizz.push(question.id)"
                    @remove="(question) => quizz.splice(quizz.findIndex(el => el == question.id), 1)" />
            </template>
            <template v-slot:newElement="{ nextOrder }">
                <NewElement v-if="$can('create', 'question')" :order="nextOrder" @add="addQuestion" />
            </template>
        </List>
        <SlideOver v-show="selectedQuestion != null" ref="editSldier"
            :open="selectedQuestion != null"
            @close="$store.commit('questions/setSelectedQuestionId', null)">
                <template class="w-full mt-8" v-if="selectedQuestion != null">
                    <Form :entity="selectedQuestion" grid :columns="2" label-root="question" class="mb-2">
                        <Field :name="`texts.${language}`" hideLabel type="text" class="col-span-full" />
                        <Field name="type" type="select" :options="QuestionTypes" class="col-span-full sm:col-span-1" />
                        <Field name="canChangeAnswer" inline type="boolean" />
                    </Form>
                    <component :is="selectedQuestion.type" ref="editor" />
                    <div class="w-full flex flex-wrap mt-3 px-3">
                        <button class="btn btn-green" @click="updateQuestion(), $refs.editSldier.close()">{{$t('actions.save')}}</button>
                    </div>
                </template>
        </SlideOver>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { mapModels } from "@/mixins/mapModels"
import Question from '@/components/List/Elements/Question'
import NewElement from '@/components/List/NewElement'
import List from '@/components/List/List'
import SlideOver from '@/components/Layout/SlideOver'
import Slider from "@/components/Question/Slider"
import MultipleChoice from "@/components/Question/MultipleChoice"

export default {
    components: {
        List,
        Question,
        NewElement,
        SlideOver,
        Slider,
        MultipleChoice,
    },
    data: function(){
        return {
            loaded: false,
            toggleInProgress: false,
            quizz: [],
        }
    },
    computed: {
        ...mapState('questions', ['questions']),
        ...mapGetters('questions', ['selectedQuestion']),
        ...mapGetters('gameboard', ['pollIsLive']),
        ...mapModels(['QuestionTypes']),
    },
    async mounted(){
        await this.bindQuestionsRef();
        await this.bindGameboard();
        this.loaded = true;
    },
    methods: {
        ...mapActions('questions', ['bindQuestionsRef', 'addQuestionRef', 'updateQuestionRef', 'updateAnswerRef', 'updateBatchQuestionsRef', 'startQuizzRef', 'stopQuizzRef']),
        ...mapActions('gameboard', ['bindGameboard']),
        async addQuestion(newQuestion){
            var computedNewQuestion = {
                order: newQuestion.order,
                type: 'multiple-choice',
                canChangeAnswer: false,
                defaultAnswer: null,
                defaultAnswerId: null,
                texts: {},
                slider: {},
                id: Math.floor(Math.random() * 10000).toString()
            }
            computedNewQuestion['texts'][this.language] = newQuestion.text
            await this.addQuestionRef(computedNewQuestion)
        },
        async onSorted(sortedQuestions){
            await this.updateBatchQuestionsRef(sortedQuestions);
        },
        async updateQuestion(){
            await this.$refs.editor.save();
            await this.updateQuestionRef(this.selectedQuestion).then(this.showSuccess).catch(this.showError)
        },
        async toggleQuizz() {
            this.toggleInProgress = true;
            if (this.pollIsLive)
                await this.stopQuizzRef()
            else {
                await this.startQuizzRef(this.quizz)
                this.quizz = []
            }
            this.toggleInProgress = false;
        }
    },
}
</script>
