<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap align-center>
        <v-progress-circular v-if="loadingBoard || loadingLists" :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
        <v-flex xs12>
          <h2 v-if="board">{{board.name}}</h2>
        </v-flex>
        <v-flex v-for="list in lists" :key="list._id " sm3 pa-2>
          <v-card @dragover="setDroppingList($event,list)" :class="{'purple lighten-3':droppingList == list}">
            <v-card-title primary-title>
              <v-layout column>
                <v-flex xs12>
              <div class="headline">{{list.name}}</div>
                </v-flex>
                <v-flex xs12 v-if="cardsByListId[list._id]">
                  <v-card
                  class="mx-auto cardy"
                  color="#26c6da"
                  dark
                  v-for="card in cardsByListId[list._id]" :key="card._id"
                  draggable="true"
                  @dragstart="startDraggingCard(card)"
                  @dragend="dropCard()"
                  >
                  <v-card-text class="font-weight-bold title" >
                      {{card.title}}
                     </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-card-title>
        <v-card-actions>
              <!--add card section-->
              <CreateCard
                :listId="list._id"
                :boardId="$route.params.id"
              ></CreateCard>
              <!---Add card section end-->
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex sm3 pa-2>
          <v-card>
            <v-card-title primary-title>
              <div>
                <div class="headline">Create List</div>
                <v-form
                  v-if="!creatingList"
                  v-model="validList"
                  @submit.prevent="createList"
                  @keydown.prevent.enter
                >
                  <v-text-field v-model="list.name" :rules="notEmptyRules" label="Name" required></v-text-field>
                  <v-btn color="warning" type="submit" :disabled="!validList">Create List</v-btn>
                </v-form>
                <v-progress-circular
                  v-if="creatingList"
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
import CreateCard from './../components/CreateCard';
export default {
  name: 'board',
  components:{
    CreateCard
  },
  data: () => ({
    droppingList:null,
    draggingCard:null,
    board: {},
    validList: false,
    list: {
      name: '',
      order: 0,
      archived: false,
    },//empty rules for form validation 
    notEmptyRules: [value => !!value || 'Can not be empty'],
  }),
  mounted() {
    //geting boards by id & realtime update
    this.getBoard(this.$route.params.id)
      .then((response) => {
        this.board = response.data || response;
      });
    // find list by id
    this.findLists({
      query: {
        boardId: this.$route.params.id,
      },
    }).then((response) => {
      const lists = response.data || response;
    });

     this.findCards({
      query: {
        boardId: this.$route.params.id,
      },
    }).then((response) => {
      const cards = response.data || response;
    });

  },

  methods: {
    // vuex actions to find required
    ...mapActions('boards', { getBoard: 'get' }),
    ...mapActions('lists', { findLists: 'find' }),
    ...mapActions('cards', { findCards: 'find' }),
    // create list function
    createList() {
      if (this.validList) {
        const { List } = this.$FeathersVuex;
        this.list.boardId = this.$route.params.id;
        const list = new List(this.list);
        list.save();
        this.board = {
          name: '',
          order: 0,
          archived: false,
        };
        this.list.name = '';
      }
    },
    startDraggingCard(card){
      console.log('started dragging...',card);
      this.draggingCard = card;
    },
    setDroppingList(event,list){
      this.droppingList = list;
      event.preventDefault();
    },
    dropCard(){
      if(this.droppingList){
        this.draggingCard.listId = this.droppingList._id;
        this.draggingCard.save();
      }
      this.droppingList = null;
      this.draggingCard = null;
    },
  },
  computed: {
    //pending status for loading..
    ...mapState('boards', {
      loadingBoard: 'isGetPending',
    }),
    ...mapState('lists', {
      loadingLists: 'isFindPending',
      creatingList: 'isCreatePending',
    }),
    //getters for  getting lists and cards from vuex store
    ...mapGetters('lists', { findListsInStore: 'find' }),
    ...mapGetters('cards', { findCardsInStore: 'find' }),
    // getting lists from vuex store
    lists() {
      return this.findListsInStore({
        query: {
          boardId: this.$route.params.id,
        },
      }).data;
    },
    // getting cards from vuex store
    cards() {
      return this.findCardsInStore({
        query: {
          boardId: this.$route.params.id,
        },
      }).data;
    },
    cardsByListId(){
      return this.cards.reduce((byId,card)=>{
        byId[card.listId] = byId[card.listId] || [];
        byId[card.listId].push(card);
        return byId;
      },{});
    }
  },
};
</script>
<style>
.cardy{
  margin-top:5px !important;
}
</style>