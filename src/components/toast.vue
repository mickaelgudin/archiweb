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
        /**
        * defining a method that parent can invoke, don't use props here to reduce props in parent component
        * @param  {String} type kind of toast(error, sucess)
        * @param {String} message text showed by the toast
        * @param {String} seconds number of seconds during which we display the toast
        */
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