import { defineEventHandler, createRouter, useBase } from 'h3'

const router = createRouter()
const path = '/idols'
router
    .get(
        path,
        defineEventHandler(() => {
            return 'nice'
        })
    )
    .post(
        '',
        defineEventHandler(() => 'ddd')
    )

export default router.handler
