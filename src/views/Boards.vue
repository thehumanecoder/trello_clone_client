<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap>
        <v-progress-circular v-if="loading" :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
        <v-flex v-for="board in boards" :key="board._id " sm3 pa-2>
          <v-card>
            <v-img
            height="200px"
            :src="board.background"
            ></v-img>
            <v-card-title primary-title>
              <div class="headline">{{board.name}}</div>
            </v-card-title>
            <v-card-action>
              <v-btn color="warning" :to="{name:'board',params:{id:board._id}}">View</v-btn>
            </v-card-action>
          </v-card>
        </v-flex>
        <v-flex sm3 pa-2>
          <v-card>
            <v-card-title primary-title>
              <div>
                <div class="headline">Create Board</div>
                <v-form
                  v-if="!creating"
                  v-model="valid"
                  @submit.prevent="createBoard"
                  @keydown.prevent.enter
                >
                  <v-text-field v-model="board.name" :rules="notEmptyRules" label="Name" required></v-text-field>
                  <v-text-field
                    v-model="board.background"
                    :rules="notEmptyRules"
                    label="Background"
                    required
                  ></v-text-field>
                  <v-btn type="submit" :disabled="!valid">Create</v-btn>
                </v-form>
                <v-progress-circular
                  v-if="creating"
                  :size="70"
                  :width="7"
                  color="primary"
                  indeterminate
                ></v-progress-circular>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  name: 'boards',
  data: () => ({
    valid: false,
    board: {
      name: '',
      background: '',
    },
    notEmptyRules: [value => !!value || 'Can not be empty'],
  }),
  mounted() {
    this.findBoards({ query: {} }).then((response) => {
      const boards = response.data || response;
    });
  },
  methods: {
    ...mapActions('boards', { findBoards: 'find' }),

    createBoard() {
      if (this.valid) {
        const { Board } = this.$FeathersVuex;
        const board = new Board(this.board);
        board.save();
        this.board = {
          name: '',
          background: '',
        };
      }
    },
  },
  computed: {
    ...mapState('auth', { user: 'payload' }),
    ...mapState('boards', {
      loading: 'isFindPending',
      creating: 'isCreatePending',
    }),
    ...mapGetters('boards', { findBoardsInStore: 'find' }),
    boards() {
      return this.user ? this.findBoardsInStore({
        query: {
          ownerId: this.user.userId,
        },
      }).data : [];
    },
  },
};
</script>
