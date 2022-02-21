import registerVant from './register-vant'

export function globalRegister(app) {
  app.use(registerVant)
}
