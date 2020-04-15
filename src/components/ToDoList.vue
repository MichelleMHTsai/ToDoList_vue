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
              @keyup.enter="addTask"
            />
          </v-col>
          <v-col cols=1>
            <v-btn color="indigo lighten-2" icon large @click="addTask">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
          <v-col cols=1>
            <v-btn color="indigo lighten-2" icon large @click="checkAll">
              <v-icon>mdi-check-all</v-icon>
            </v-btn>
          </v-col>
          <v-col cols=1>
            <v-btn color="indigo lighten-2" icon large @click="removeDone">
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
                <v-checkbox v-if="viewToDo[i].isDone" input-value="todos.isDone" @change="updateTask(todos, 'isDone')" color="indigo lighten-2" />
                <v-checkbox v-else @change="updateTask(todos, 'isDone')" />
                <v-text-field v-if="todos.isEdit" :value="todos.task" @keyup="$event.keyCode === 13 ? updateTask(todos, 'isEdit') : updateTaskContent(todos, 'content', $event.target.value)" @blur="updateTask(todos, 'isEdit')" style="width:80%;" />
                  <span v-else :class="todos.isDone ? 'task_done_style' : ''" style="width:80%;">{{todos.task}}</span>
                <v-spacer></v-spacer>
                <v-btn icon @click="updateTask(todos, 'isEdit')"><v-icon>mdi-square-edit-outline</v-icon></v-btn>
                <v-btn icon @click="deleteTask(todos.uuid)"><v-icon>mdi-trash-can-outline</v-icon></v-btn>
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
              <v-btn-toggle :value="taskFilter" @change="changeView">
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
  computed: {
    newTask: {
      get () {
        return this.$store.getters.newTask
      },
      set (str) {
        this.$store.dispatch('newTask', str)
      }
    },
    toDos: {
      get () {
        return this.$store.getters.toDos
      }
    },
    viewToDo: {
      get () {
        return this.$store.getters.viewToDo
      }
    },
    taskFilter: {
      get () {
        return this.$store.getters.taskFilter
      }
    }
  },
  methods: {
    addTask () {
      this.$store.dispatch('addNewTask')
    },
    checkAll () {
      this.$store.dispatch('checkAll')
    },
    removeDone () {
      this.$store.dispatch('deleteDone')
    },
    updateTask (payload, updateMode) {
      let newPayload = Object.assign(payload, { mode: updateMode })
      this.$store.dispatch('updateTaskStatus', newPayload)
    },
    updateTaskContent (payload, updateMode, str) {
      Object.assign(payload, { mode: updateMode })
      payload['task'] = str
      this.$store.dispatch('updateTaskStatus', payload)
    },
    deleteTask (id) {
      this.$store.dispatch('deleteTask', id)
    },
    changeView (value) {
      this.$store.dispatch('updateFilter', value)
    }
  }
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
