import React from 'react'
import Feed from './Feed'
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import * as Router from "next/navigation";

describe('<Feed />', () => {
  it('renders', () => {
    const router = {
      push: cy.stub().as('router:push'),
      back: cy.stub().as('router:back'), 
      forward: cy.stub().as('router:forward'), 
      refresh: cy.stub().as('router:refresh'), 
      replace: cy.stub().as('router:replace'), 
      prefetch: cy.stub().as('router:prefetch')
    }
    cy.stub(Router, 'useRouter').returns(router)

    cy.mount(
      <AppRouterContext.Provider value={router}>
        <Feed />
      </AppRouterContext.Provider>
    )
  })
})