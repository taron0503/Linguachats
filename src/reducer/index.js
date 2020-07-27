import { combineReducers } from 'redux'
import EmojiPicker from "./EmojiPicker"
import WindowToggle from "./WindowToggle"
import main_reducer from "./main_reducer"

export default combineReducers({
  EmojiPicker,
  WindowToggle,
  main_reducer
})