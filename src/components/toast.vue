<template>
    <div id="mytoast">
        <v-alert class="mt-4" :type="typeToast" v-if="message != '' " >
            {{message}}
        </v-alert>
    </div>
</template>

<script>
export default {
    name: "toast",
    data () {
        return {
            message: '',
            typeToast: ''
        }
    },
    methods : {
        displayToast : function(type, message, seconds) {
            this.message = message;
            this.typeToast = type;
            window.setInterval(() => {
                this.message = '';
            }, seconds*1000);
        }
    }
}
</script>