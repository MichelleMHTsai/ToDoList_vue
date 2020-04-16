'use strict'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    newTask: '',
    taskFilter: 'all',
    toDos: [],
    checkAll: false,
    uuid: ''
  },
  getters: {
    toDos: state => {
      return state.toDos
    },
    newTask: state => {
      return state.newTask
    },
    taskFilter: state => {
      return state.taskFilter
    },
    viewToDo: state => {
      return state.taskFilter === 'all' ? state.toDos : state.toDos.length > 0 ? state.toDos.filter(task => task.isDone === Boolean(state.taskFilter === 'done')) : []
    },
    checkAll: state => {
      return state.checkAll
    },
    getUUID: state => {
      return state.uuid
    }
  },
  mutations: {
    newTask (state, str) {
      state.newTask = str
    },
    checkAll (state) {
      state.checkAll = !state.checkAll
      state.toDos.forEach(tos => tos.isDone = state.checkAll)
    },
    deleteTask (state, idx) {
      state.toDos.splice(idx, 1)
    },
    changeUUID (state, id) {
      state.uuid = id
    },
    addNewTask (state, task) {
      state.toDos.push(task)
    },
    updateTaskContent (state, payload) {
      state.toDos[payload.idx].task = payload.str
    },
    updateTaskEdit (state, idx) {
      state.toDos[idx].isEdit = !state.toDos[idx].isEdit
    },
    updateTaskDone (state, idx) {
      state.toDos[idx].isDone = !state.toDos[idx].isDone
    },
    updateFilter (state, val) {
      state.taskFilter = val
    },
    resetCheckAll (state) {
      state.checkAll = false
    }
  },
  actions: {
    __uuid ({ commit }) {
      let date = Date.now()
      let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (text) {
        let random = (date + Math.random() * 16) % 16 | 0
        date = Math.floor(date / 16)
        return (text === 'x' ? random : (random & 0x3 | 0x8)).toString(16)
      })
      commit('changeUUID', id)
    },
    newTask ({ commit }, str) {
      commit('newTask', str)
    },
    checkAll ({ commit }) {
      commit('checkAll')
    },
    deleteDone ({ getters, commit }) {
      let doneIndex = getters.toDos.map(function (task, i) {
        if (task.isDone) return i
      })
      for (let i = doneIndex.length - 1; i >= 0; i--) {
        doneIndex[i] !== undefined && commit('deleteTask', doneIndex[i])
      }
    },
    deleteTask ({ getters, commit }, uuid) {
      let taskIdx = getters.toDos.findIndex(task => task.uuid === uuid)
      commit('deleteTask', taskIdx)
    },
    addNewTask ({ getters, dispatch, commit }) {
      dispatch('__uuid')
      let defaultTask = {
        uuid: getters.getUUID,
        task: getters.newTask,
        isEdit: false,
        isDone: false
      }
      commit('addNewTask', defaultTask)
      dispatch('newTask', '')
      if (getters.checkAll) commit('resetCheckAll')
    },
    updateTaskStatus ({ getters, commit }, payload) {
      /* payload is an Object which contains
        payload: {
          uuid: String,
          isEdit: Boolean,
          isDone: Boolean,
          task: String,
          mode: String
        }
      */
      let taskIdx = getters.toDos.findIndex(todo => todo.uuid === payload.uuid)
      Object.assign(payload, { idx: taskIdx })
      payload.mode === 'isDone' ? commit('updateTaskDone', taskIdx) : payload.mode === 'isEdit' ? commit('updateTaskEdit', taskIdx) : commit('updateTaskContent', { idx: taskIdx, str: payload.task})
    },
    updateFilter ({ commit }, val) {
      commit('updateFilter', val)
    }
  }
})

export default store