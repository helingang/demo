<template>
    <section class="real-app">
        <input type="text" class="add-input" autofocus='autofocus' placeholder="下面要做什么呢?" @keyup.enter='addTodo'>
        <Item :todo='todo' v-for='todo in filtedTodos' :key='todo.id' @del='deleteTodo'></Item>
        <Tabs :filter='filter' :todos='todos' @toggle='toggleFilter' @clearAllCompleted='clearAllCompleted'></Tabs>
    </section>
</template>

<script>
import Item from './item.vue'
import Tabs from './tabs.vue'
let id = 0;
export default {
    data(){
        return {
            todos: [],
            filter: 'all'
        }
    },
    methods: {
        addTodo(e){
            if(e.target.value != ''){
                this.todos.unshift({
                    id: id++,
                    content: e.target.value.trim(),
                    completed: false,
                })
                e.target.value = ''
            }
            
        },
        deleteTodo(id){
            this.todos.splice(this.todos.findIndex(val => val.id === id), 1)
        },
        toggleFilter(state){
            this.filter = state
        },
        clearAllCompleted(){
            this.todos = this.todos.filter(val => val.completed != true)
        }
    },
    components: {
        Item: Item,
        Tabs: Tabs
    },
    computed: {
        // 经过all,active,completed过滤后的todos
        filtedTodos(){
            if(this.filter === 'all'){
                return this.todos
            }
            const completed = this.filter === 'completed'
            return this.todos.filter(value => completed === value.completed)
        }
    }
}
</script>

<style>
.real-app{
    width: 600px;
    margin: 0 auto;
    box-shadow: 0 0 5px #666;
}
.add-input{
    position: relative;
    margin: 0;
    width: 100%;
    font-size: 24px;
    font-family: inherit;
    font-weight: inherit;
    line-height: 1.4;
    border: 0;
    outline: none;
    color: inherit;
    box-sizing: border-box;
    padding: 16px 16px 16px 36px
}
</style>

