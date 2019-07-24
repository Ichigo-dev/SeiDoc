import * as React from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '../store'
import { System } from '../reducers/systemsReducer'
import Indicator from './indicator'

const SystemList: React.FC = () => {
    const systems = useSelector((state: AppState) => state.systemsState.systems)
    const loading = useSelector((state: AppState) => state.systemsState.loading)
    return (
        <div>
            {console.log('loading:', loading)}
            {console.log('systems:', systems)}
            {loading ? <Indicator /> :
                systems.length === 0 ?
                    <p>検索結果がありません</p>
                    :
                    <ul>
                        {systems.map((system: System) => (
                            <li key={system.Name}>
                                <h4>{system.Name}</h4>
                                <p>{system.Location}</p>
                            </li>
                        ))}
                    </ul>
            }
        </div>
    )
}
export default SystemList