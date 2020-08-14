// AdminUsersList.spec.js

import { shallowMount } from '@vue/test-utils'
import AdminUsersList from './views/AdminUsersList'

// eslint-disable-next-line no-undef
describe('AdminUsersList', () => {
    // eslint-disable-next-line no-undef
    it('should render to a snapshot when list is empty', () => {
        const propsData = { userList: [] }
        const wrapper = shallowMount(AdminUsersList, { propsData })
        // eslint-disable-next-line no-undef
        expect(wrapper.element).toMatchSnapshot()
    })

    // eslint-disable-next-line no-undef
    it('should render to a snapshot when list has items', () => {
        const propsData = { userList: [{ id: 1, text: 'Todo #1' }] }
        const wrapper = shallowMount(AdminUsersList, { propsData })
        // eslint-disable-next-line no-undef
        expect(wrapper.element).toMatchSnapshot()
    })
})