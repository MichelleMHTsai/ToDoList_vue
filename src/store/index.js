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
    viewToDo: state => {
      return state.taskFilter === 'all' ? state.toDos : state.toDos.filter(task => task.isDone === Boolean(state.taskFilter === 'done'))
    },
    newTask: state => {
      return state.newTask
    },
    taskFilter: state => {
      return state.taskFilter
    },
    toDos: state => {
      return state.toDos
    },
    checkAll: state => {
      return state.checkAll
    },
    uuid: state => {
      return state.uuid
    }
  },
  mutations: {
    generateUUID (state, id) {
      state.uuid = id
    },
    taskDetail (state, detail) {
      state.newTask = detail
    },
    addNewTask (state, task) {
      state.toDos.push(task)
      state.newTask = ''
    },
    deleteTask (state, index) {
      state.toDos.splice(index, 1)
    },
    checkAll (state, bool) {
      state.toDos.forEach(task => task.isDone = bool)
    },
    taskFilter (state, taskFilter) {
      state.taskFilter = taskFilter
    }
  },
  actions: {
    generateUUID ({ commit }) {
      let date = Date.now()
      let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (text) {
        let random = (date + Math.random() * 16) % 16 | 0
        date = Math.floor(date / 16)
        return (text === 'x' ? random : (random & 0x3 | 0x8)).toString(16)
      })
      commit('generateUUID', id)
    },
    taskDetail({ commit }, detail) {
      commit('taskDetail', detail)
    },
    addNewTask({ getters, dispatch, commit }) {
      dispatch('generateUUID')
      let defaultTask = {
        uuid: getters.uuid,
        task: getters.taskDetail,
        isEdit: false,
        isDone: false
      }
      commit('addNewTask', defaultTask)
    },
    deleteTask({ getters, commit }, id) {
      let toDoindex = getters.toDos.findIndex(todo => todo.uuid === id)
      commit('deleteTask', toDoindex)
    },
    deleteDone({ getters, commit }) {
      let doneIndex = getters.toDos.map(function (task, i) {
        if (task.isDone) return i
      })
      for (let i = doneIndex.length - 1; i >= 0; i--) {
        doneIndex[i] && commit('deleteTask', doneIndex[i])
      }
    },
    checkAll ({ commit }, bool) {
      commit('checkAll', bool)
    },
    taskFilter ({ commit }, taskFilter) {
      commit('taskFilter', taskFilter)
    }
  }
})

export default store