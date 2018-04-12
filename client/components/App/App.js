import React from 'react'
import styles from './App.scss'
import { isAuthenticated } from 'modules/auth/utils'
import '../../styles/global.scss'

const title = 'Gutenberg'

let App = (props: { children: Object }) =>
  <div>
    {props.children}
  </div>

export default function App(ComposedClass) {
  return (props) =>
    <App {...props} >
      <ComposedClass {...props} />
    </App>
}
