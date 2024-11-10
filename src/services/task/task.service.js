import { makeId } from '../util.service.js'

const labels = [
    { id: 'l101', color: '#4BCE97', title: '' },
    { id: 'l102', color: '#F5CD47', title: '' },
    { id: 'l103', color: '#FEA362', title: '' },
    { id: 'l104', color: '#F87168', title: '' },
    { id: 'l105', color: '#9F8FEF', title: '' },
    { id: 'l106', color: '#579DFF', title: '' },
]

export const taskService = {
    getLabels
}

function getLabels() {
    return labels
}