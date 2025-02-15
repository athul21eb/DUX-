import React from 'react'

async function AboutPage() {

  await await new Promise((res) => setTimeout(() => res("hi"), 3000));

  return (
    <div>AboutPage</div>
  )
}

export default AboutPage