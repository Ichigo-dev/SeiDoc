import actionCreatorFactory from 'typescript-fsa'
import { fireStore } from '../firebase/index'
import { Dispatch } from 'redux'
import algoliasearch from 'algoliasearch';
import { System } from '../reducers/systemsReducer'

const actionCreator = actionCreatorFactory()

export const fetchSystemByCategoryCreator = actionCreator.async<undefined, Array<System>, undefined>('SYSTEM_FETCH_BY_CATEGORY')
export const fetchSystemByAlgoliaSearchCreator = actionCreator.async<undefined, Array<System>, undefined>('SYSTEM_FETCH_BY_ALGOLIASEARCH')
export const deleteSystemsCreator = actionCreator('DELETE_SYSTEMS')

export const fetchSystemByCategory = (query: string) => (dispatch: Dispatch) => {
    console.log('start fetchSystem query:', query)
    const searchData: Array<System> = []
    dispatch(fetchSystemByCategoryCreator.started())
    fireStore.collection('systems').where('Category', 'array-contains', query).get()
        .then(
            (snapshot) => {
                snapshot.forEach((doc) => {
                    searchData.push(doc.data() as System)
                })
            }).then(() => {
                dispatch(fetchSystemByCategoryCreator.done({
                    params: undefined,
                    result: searchData
                }))
            })
}
export const fetchSystemAll = () => (dispatch: Dispatch) => {}
export const updateSystem = (uuid: string,newData: System) => {}
export const deleteSystem = (uuid: string) => {}


export const fetchSystemByAlgoliaSearch = (query: string, category: string) => (dispatch: Dispatch) => {
    const client = algoliasearch('XW5SXYAQX9', '81fe6c5ab81e766f4ec390f474dde5b9')
    const index = client.initIndex('test_firestore')
    dispatch(fetchSystemByAlgoliaSearchCreator.started())
    index.search({
        query: query,
        facetFilters: [category]
    }, (err, res) => {
        if (err) {
            console.error(err)
            return
        }
        console.log(res)
        dispatch(fetchSystemByAlgoliaSearchCreator.done({
            params: undefined,
            result: res.hits as Array<System>
        }))

    })
}

export const addTagCreator = actionCreator<string>('ADD_TAG')
export const deleteTagCreator = actionCreator('DELETE_TAG')

export const updateDetailCreator = actionCreator<System>('CHANGE_SYSTEMLIST')