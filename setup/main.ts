import Antd from "ant-design-vue";
import { defineAppSetup } from 'valaxy'
import 'ant-design-vue/dist/antd.css';

export default defineAppSetup(({ app }) => {
  app.use(Antd)
})