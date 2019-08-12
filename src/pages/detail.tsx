import React from 'react';
import DetailList from '../components/detailList'
import { RouteComponentProps } from 'react-router'
import "../scss/detail.scss"

type historyProps = RouteComponentProps<{documentId: string}>

const Detail: React.FC<historyProps> = (props: historyProps) => {
    const documentId = props.match.params.documentId
    return (
        <DetailList documentId={documentId}/>
    )
}

export default Detail