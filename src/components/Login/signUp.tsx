import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loginCreator } from '../../actions/action'
import { UserState } from '../../reducers/loginReducer'
import { AppState } from '../../store'
import { fireStore, auth } from '../../firebase/firebase'
import firebase from 'firebase'
import { withRouter, RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'

type historyProps = RouteComponentProps

type loginData = {
    email: string,
    password: string
}
type locationData = {
    prefecture: string,
    city: string,
    municipality: string
}
type birthdayData = {
    year: string,
    month: string,
    date: string
}

const cityData = require('../../datas/cityData.json')
const municipalityData = require('../../datas/municipalityData.json')

const SignUp: React.FC<historyProps> = (props) => {
    const [loginData, setLoginData] = useState<loginData>({ email: '', password: '' })
    const [cityArray, setCityArray] = useState<Array<string>>(['選択してください'])
    const [municipalityArray, setMunicipalityArray] = useState<Array<string>>(['選択してください'])
    const [locationData, setLocationData] = useState<locationData>({ prefecture: '', city: '', municipality: '' })
    const [birthdayData, setBirthdayData] = useState<birthdayData>({ year: '', month: '', date: '' })
    const userData = useSelector((state: AppState) => state.userState)
    const dispatch = useDispatch()
    const login = (data: UserState) => dispatch(loginCreator(data))

    const handleSignUp = () => {
        const email = loginData.email
        const password = loginData.password
        const birthday = ('000' + birthdayData.year).slice(-4) + '-' + ('0' + birthdayData.month).slice(-2) + '-' + ('0' + birthdayData.date).slice(-2)
        const address = locationData.prefecture + locationData.city + locationData.municipality
        userData['birthday'] = birthday
        userData['address'] = address

        if (password.length < 8) {
            alert('Please enter a password')
            return
        }

        auth.createUserWithEmailAndPassword(email, password).then(res => {
            const user = res.user as firebase.User
            userData['userId'] = user.uid
        }).then(() => {
            console.log('userData:', userData)
            login(userData)
            props.history.push('/')
            handleFirebaseSetUserdata()
        }).catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            if (errorCode === 'auth/weak-password') {
                alert('The password is too weak.')
            } else {
                alert(errorMessage)
            }
            console.log(error)
        })
    }


    const handleLoginDataInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as 'email' | 'password'
        loginData[name] = e.target.value
        setLoginData(Object.assign({}, loginData))
    }

    const handleUserdataInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.name as 'family' | 'nickName' | 'income'
        userData[name] = e.target.value
    }

    const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.name as 'prefecture' | 'city' | 'municipality'
        locationData[name] = e.target.value
        setLocationData(Object.assign({}, locationData))
        if (name === 'prefecture') {
            const location = cityData[e.target.value] as Array<string>
            setCityArray(location)
        } else if (name === 'city') {
            const location = municipalityData[e.target.value] as Array<string>
            if (typeof location === 'undefined') {
                setMunicipalityArray(['選択してください'])
            } else {
                setMunicipalityArray(location)
            }
        }
    }

    const handleBirthdayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.name as 'year' | 'month' | 'date'
        birthdayData[name] = e.target.value
        setBirthdayData(Object.assign({}, birthdayData))
    }

    const birthdayInputLoop = (start: number, end: number) => {
        const items = []
        items.push(<option key="" value="">選択してください</option>)
        for (let i = start; i < end; i++) {
            items.push(<option key={i} value={i}>{i}</option>)
        }
        return items
    }

    const handleFirebaseSetUserdata = () => {
        const uid = userData.userId
        const sendData = userData
        delete sendData.userId
        fireStore.collection('user').doc(uid).set(sendData).then(res => {
            console.log('set firebase', uid)
        })
    }

    return (
        <div>
            <p>メールアドレス</p>
            <input type="text" name="email" onChange={e => handleLoginDataInputChange(e)}></input>
            <p>パスワード</p>
            <input type="password" name="password" onChange={e => handleLoginDataInputChange(e)}></input>
            <p>ニックネーム</p>
            <input type="text" name="nickName" onChange={e => handleUserdataInputChange(e)}></input>
            <p>生年月日</p>
            <select name="year" onChange={e => handleBirthdayChange(e)}>
                {birthdayInputLoop(1950, 2019)}
            </select>
            <select name="month" onChange={e => handleBirthdayChange(e)}>
                {birthdayInputLoop(1, 12)}
            </select>
            <select name="date" onChange={e => handleBirthdayChange(e)}>
                {birthdayInputLoop(1, 31)}
            </select>
            <p>年収</p>
            <select name="income" onChange={e => handleUserdataInputChange(e)}>
                <option value="">選択してください</option>
                <option value="200万円未満">200万円未満</option>
                <option value="200~400万円">200~400万円</option>
                <option value="400~600万円">400~600万円</option>
                <option value="600~800万円">600~800万円</option>
                <option value="800~1000万円">800~1000万円</option>
                <option value="1000万円以上">1000万円以上</option>
            </select>
            <p>居住区</p>
            <select name="prefecture" onChange={e => handleAddressChange(e)}>
                <option value="">選択してください</option>
                <option value="愛知県">愛知県</option>
                <option value="岐阜県">岐阜県</option>
                <option value="三重県">三重県</option>
            </select>
            <select name="city" onChange={e => handleAddressChange(e)}>
                {cityArray.map((cityName) => (
                    <option key={cityName} value={cityName}>{cityName}</option>
                ))}
            </select>
            <select name="municipality" onChange={e => handleAddressChange(e)}>
                {municipalityArray.map((municipalityName) => (
                    <option key={municipalityName} value={municipalityName}>{municipalityName}</option>
                ))}
            </select>
            <p>家族構成</p>
            {/* <input type="text" name="family" onChange={e => handleUserdataInputChange(e)}></input> */}
            <select name="family" onChange={e => handleUserdataInputChange(e)}>
                <option value="">選択してください</option>
                <option value="ひとり親家庭">ひとり親家庭</option>
                <option value="選択肢1">選択肢1</option>
                <option value="選択肢2">選択肢2</option>
                <option value="選択肢3">選択肢3</option>
            </select>
            <button onClick={() => handleSignUp()}>登録</button>
            <Link to='/login'>ログインはこちらから</Link>
        </div>
    )
}


export default withRouter<historyProps, React.FC<historyProps>>(SignUp)