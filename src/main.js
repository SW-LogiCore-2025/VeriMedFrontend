import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'


import PrimeVue from 'primevue/config'


import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Checkbox from 'primevue/checkbox'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Menu from 'primevue/menu'
import Menubar from 'primevue/menubar'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Dropdown from 'primevue/dropdown'
import FileUpload from 'primevue/fileupload'
import Calendar from 'primevue/calendar'
import Textarea from 'primevue/textarea'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import ProgressSpinner from 'primevue/progressspinner'


import 'primevue/resources/themes/arya-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const app = createApp(App)


app.use(createPinia())
app.use(router)


app.use(PrimeVue)


app.use(ToastService)


app.component('Button', Button)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Card', Card)
app.component('Dialog', Dialog)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Checkbox', Checkbox)
app.component('Toast', Toast)
app.component('Menu', Menu)
app.component('Menubar', Menubar)
app.component('Avatar', Avatar)
app.component('Badge', Badge)
app.component('Dropdown', Dropdown)
app.component('FileUpload', FileUpload)
app.component('Calendar', Calendar)
app.component('Textarea', Textarea)
app.component('InputGroup', InputGroup)
app.component('InputGroupAddon', InputGroupAddon)
app.component('ProgressSpinner', ProgressSpinner)

app.mount('#app')