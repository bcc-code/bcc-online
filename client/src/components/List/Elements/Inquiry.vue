<template>
    <li class="mb-2">
        <div class="list-item" :class="isLive ? 'bg-downy' : 'bg-background-2'">
            <div v-if="inQueue" class="list-item-order handle">{{inquiry.order}}</div>
            <div class="flex-1 pl-1 mr-16">
                <div class="font-medium" v-html="text"></div>
                <div class="text-gray-600 text-sm" >{{inquiry.displayName}} - {{inquiry.churchName}}, {{inquiry.countryName}}</div>
            </div>
            <div v-if="$can('update', inquiry)" class="overlay">
                <template v-if="inQueue && !isLive">
                    <button class="btn btn-green" @click.stop="showInquiry(inquiry)">{{$t('actions.show')}}</button>
                    <span v-if="$can('delete', inquiry)" class="btn btn-delete" @click.stop="removeInquiryFromQueue(inquiry)"><i class="fa fa-times"></i></span>
                </template>
                <template v-if="inQueue && isLive">
                    <button class="btn btn-red" @click.stop="hideInquiry">{{$t('actions.hide')}}</button>
                </template>
                <template v-else-if="!inQueue">
                    <button class="btn btn-green" @click.stop="approveInquiry(inquiry)">{{$t('actions.approve')}}</button>
                    <span v-if="$can('delete', inquiry)" class="btn btn-delete" @click.stop="removeInquiry(inquiry)"><i class="fa fa-times"></i></span>
                </template>
            </div>
        </div>
    </li>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
    props: {
        inquiry: {
            type: Object,
            required: true
        },
        searchQuery: {
            type: String,
            default: ''
        },
        inQueue: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters('inquiries', ['currentInquiry']),
        text() {
            return (this.searchQuery && this.searchQuery.trim()) 
                ? this.inquiry.text.replace(new RegExp(`(${this.searchQuery})`, "gi"), "<span class='bg-seagull rounded-sm'>\$1</span>") 
                : this.inquiry.text;
        },
        isLive() {
            return this.currentInquiry != null && this.currentInquiry.id == this.inquiry.id;
        },
    },
    methods: {
        ...mapActions('inquiries', ['removeInquiry', 'removeInquiryFromQueue', 'approveInquiry', 'showInquiry', 'hideInquiry'])
    }
}
</script>