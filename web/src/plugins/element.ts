import Vue from 'vue';
import {
  Dialog,
  Input,
  Radio,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  DatePicker,
  Form,
  FormItem,
  Col,
  Card,
  Message,
} from 'element-ui';

Vue.use(Dialog);
Vue.use(Input);
Vue.use(Radio);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Col);
Vue.use(Card);
Vue.prototype.$message = Message;