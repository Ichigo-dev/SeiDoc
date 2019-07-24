import * as React from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '../store'


const Detail: React.FC = () => {
    const detail = useSelector((state: AppState) => state.selectsystemState.selectSystem)
    console.log('detail', detail)
    return (
        <div>
            <h1>{detail.Name}</h1>
            <h2>援助対象者</h2>
            <p>{detail.Target}</p>
            <h2>援助方法</h2>
            <p>{detail.Method}</p>
            <h2>担当部署</h2>
            <p>{detail.Department}</p>
            <h2>詳細</h2>
            <p>{detail.Detail}</p>
            <a target="_blank" rel="noopener noreferrer" href={detail.Site}>
                <button>公式のページへ</button>
            </a>
        </div>
    )
}

export default Detail