<template>
    <v-data-table
            :items="items"
            :headers="itemHeaders"
            :multi-sort="true"
    >
        <template v-slot:header.action>
            <slot />
        </template>
        <template v-slot:item.action="{ item }">
            <v-btn icon small @click="$emit('edit', item)">
                <v-icon small color="blue darken-2">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small @click="$emit('delete', item)">
                <v-icon small color="blue darken-2">mdi-delete</v-icon>
            </v-btn>
        </template>
    </v-data-table>
</template>

<script>
export default {
    name: 'datatable',
    props: {
        items: {
            type: Array,
            required: true,
        },
        headers: {
            type: Array,
            required: true,
        }
    },
    computed: {
        itemHeaders() {
            const headers = this.headers.slice();
			
			// Always include custom header "Action" for the buttons to be placed in
            headers.push({
                text: '',
                value: 'action',
            });
            return headers;
        }
    }
};
</script>
