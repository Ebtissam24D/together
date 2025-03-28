import React from 'react'
import {card,card_head,card_text} from "./components.module.css"

const Card = ({title,statistic,handleClick}) => {
  return (
    <div className={card} onClick={() => handleClick()}>
          <h3 className={card_head}>{title}</h3>
          <span className={card_text}>{statistic}</span>
        </div>
  )
}

export default Card