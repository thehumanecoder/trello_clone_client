<template>
         <v-flex sm12 pa-1>
          <v-card>
            <v-card-title primary-title>
              <div>
                <div class="headline">Create Card</div>
                <v-form
                  v-if="!creatingCard"
                  v-model="validCard"
                  @submit.prevent="createCard"
                  @keydown.prevent.enter
                >
                  <v-text-field v-model="card.title" :rules="notEmptyRules" label="Title" required></v-text-field>
                  <v-btn color="primary" type="submit" :disabled="!validCard">Add</v-btn>
                </v-form>
                <v-progress-circular
                  v-if="creatingCard"
                  :size="50"
                  :width="5"
                  color="primary"
                  indeterminate
                ></v-progress-circular>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'create-card',
  props: ['listId', 'boardId'],
  data: () => ({
    creatingCard:false,
    validCard: false,
    card: {
      title: '',
      members: [],
    },
    notEmptyRules: [value => !!value || 'Can not be empty'],
  }),
  methods: {
   async createCard() {
      if (this.validCard) {
        const { Card } = this.$FeathersVuex;
        this.card.boardId = this.boardId;
        this.card.listId = this.listId;
        const card = new Card(this.card);
        this.creatingCard = true;
        await card.save();
        this.creatingCard = false;
        this.card = {
          title: '',
          members: [],
        };
      }
    },
  },
};
</script>
