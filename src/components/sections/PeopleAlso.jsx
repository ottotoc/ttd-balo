import React from 'react'
import Section from '../layout/Section.jsx'

const terms = [
  'Blue diamon almonds',
  'Angie’s Boomchickapop Corn',
  'Salty kettle Corn',
  'Chobani Greek Yogurt',
  'Sweet Vanilla Yogurt',
  'Foster Farms Takeout Crispy wings',
  'Warrior Blend Organic',
  'Chao Cheese Creamy',
  'Chicken meatballs',
]

export default function PeopleAlso() {
  return (
    <Section>
      <div className="container-fluid">
        <h2 className="my-5">People are also looking for</h2>
        {terms.concat(terms).map((t) => (
          <a key={t} href="#" className="btn btn-warning me-2 mb-2">{t}</a>
        ))}
      </div>
    </Section>
  )
}


