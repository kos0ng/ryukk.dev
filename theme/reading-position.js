import { trackOutline } from './outline.js'

const layout = document.querySelector('.reading-layout')
trackOutline(layout.querySelector('.article-toc'), layout.querySelector('.article-body'))
