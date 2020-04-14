<template>
  <v-container>
    <v-card outlined class="mx-auto" min-width="600" max-width="1000" min-height="200">
      <v-card-title class="bg_color_white list_title_style">Todo List</v-card-title>
      <v-card-text class="bg_color_white">
        <v-row justify="center">
          <v-col cols=8>
            <v-text-field
              label="Add task here"
              single-line
              solo
              clearable
              v-model="newTask"
              @keyup.enter="addNewTask"
            />
          </v-col>
          <v-col cols=1>
            <v-btn color="indigo lighten-2" icon large @click="addNewTask">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
          <v-col cols=1>
            <v-btn color="indigo lighten-2" icon large @click="checkAll = !checkAll">
              <v-icon>mdi-check-all</v-icon>
            </v-btn>
          </v-col>
          <v-col cols=1>
            <v-btn color="indigo lighten-2" icon large @click="deleteDone">
              <v-icon>mdi-playlist-remove</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-row justify="center" v-if="viewToDo.length > 0">
        <v-col cols=11>
          <v-card>
            <template v-for="(todos, i) in viewToDo">
              <v-divider v-show="i != 0" :key="i"></v-divider>
              <v-list-item :key="todos.uuid">
                <v-checkbox v-model="todos.isDone" :color="todos.isDone ? 'indigo lighten-2' : 'grey'" />
                <v-text-field v-if="todos.isEdit" v-model="todos.task" @blur="todos.isEdit = false" style="width:80%;" />
                  <span v-else :class="todos.isDone ? 'task_done_style' : ''" style="width:80%;">{{todos.task}}</span>
                <v-spacer></v-spacer>
                <v-btn icon @click="todos.isEdit = true"><v-icon>mdi-square-edit-outline</v-icon></v-btn>
                <v-btn icon @click="deleteTask(i)"><v-icon>mdi-trash-can-outline</v-icon></v-btn>
              </v-list-item>
            </template>
          </v-card>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-card-actions>
        <v-row>
          <v-col cols=12>
            <v-row align="center" class="mx-auto">
            <v-col cols=1>
              <span>{{toDos.length == 0 ? 0 : Math.round((toDos.filter(task => task.isDone === true).length / toDos.length) * 100)}}%</span>
            </v-col>
            <v-col cols=11>
              <v-progress-linear
                color="indigo lighten-2"
                background-color="grey"
                :value="toDos.length == 0 ? 0 : Math.round((toDos.filter(task => task.isDone === true).length / toDos.length) * 100)"
              />
            </v-col>
            </v-row>
          </v-col>
          <v-col cols=12>
            <v-row justify="center">
              <v-btn-toggle v-model="taskFilter">
                <v-col>
                  <v-btn rounded color="indigo lighten-2" value="all" outlined>All ({{toDos.length}})</v-btn>
                </v-col>
                <v-col>
                  <v-btn rounded color="indigo lighten-2" value="done" outlined>Done ({{toDos.filter(task => task.isDone === true).length}})</v-btn>
                </v-col>
                <v-col>
                  <v-btn rounded color="indigo lighten-2" value="remain" outlined>Remaining ({{toDos.filter(task => task.isDone === false).length}})</v-btn>
                </v-col>
              </v-btn-toggle>
            </v-row>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  // data () {
  //   return {
  //     newTask: '',
  //     taskFilter: 'all',
  //     toDos: [],
  //     percentage: 0,
  //     checkAll: false
  //   }
  // },
  watch: {
    // taskFilter: function (value) {
    //   this.viewToDo = value === 'all' ? this.toDos : this.toDos.filter(task => task.isDone === Boolean(value === 'done'))
    // },
    // percentage: function (percent) {
    //   percent = this.toDos.filter(task => task.isDone === true).length / this.toDos.length
    //   return percent
    // },
    // checkAll: function (check) {
    //   this.toDos.forEach(task => task.isDone = check)
    // }
  },
  computed: {
    taskFilter: {
      get () {
        return this.$store.getters.taskFilter
      },
      set (value) {
        this.$store.dispatch('taskFilter', value)
      }
    },
    newTask: {
      get () {
        return this.$store.getters.newTask
      },
      set (val) {
        this.$store.dispatch('taskDetail', val)
      }
    }
  }
  // computed: {
  //   viewToDo: function (view) {
  //     view = this.filter === 'all' ? this.toDos : this.toDos.filter(task => task.isDone === Boolean(this.filter === 'done'))
  //     return view
  //   }
  // },
  // methods: {
  //   addNewTask () {
  //     let uuid = this.__uuid()
  //     let defaultTask = {
  //       uuid: uuid,
  //       task: this.newTask,
  //       isEdit: false,
  //       isDone: false
  //     }
  //     this.toDos.push(defaultTask)
  //     this.newTask = ''
  //   },
  //   deleteTask (index) {
  //     let indexOftoDo = this.toDos.findIndex(toDo => toDo.task === this.viewToDo[index].task)
  //     this.toDos.splice(indexOftoDo, 1)
  //   },
  //   deleteDone () {
  //     let doneIndex = this.toDos.map(function(task, i) {
  //       if (task.isDone) return i
  //     })
  //     for (let i = doneIndex.length - 1; i >= 0; i--) {
  //       doneIndex[i] !== undefined && this.toDos.splice(doneIndex[i], 1)
  //     }
  //   },
  //   __uuid () {
  //     let date = Date.now()
  //     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (text) {
  //       let random = (date + Math.random() * 16) % 16 | 0
  //       date = Math.floor(date / 16)
  //       return (text === 'x' ? random : (random & 0x3 | 0x8)).toString(16)
  //     })
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.bg_color_white {
  background-color: #E8EAF6;
}

.list_title_style {
  color: #7986CB;
}

.task_done_style {
  text-decoration: line-through;
  color: #7986CB;
}

.btn_group_style {
  vertical-align: text-bottom;
}
</style>
