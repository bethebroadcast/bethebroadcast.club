// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve(),
  tokenBalance: 0
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized)
  const [tokenBalance, setTokenBalance] = useState<number>(0)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setIsInitialized(true)
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!

      console.log('STORED TOKEN', storedToken)
      if (storedToken) {
        setLoading(true)
        await handleLogin()

        setLoading(false)


        /*await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.userData })
            handleLogin()
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
          })
          */
      } else {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  
  useEffect(function() {

    (async () => {

      const { data } = await axios.get('https://staging-backend.relayx.com/api/token/b006ff07a70da8158c29b763d7e71fcf4ec2a69a31615c4d934aa7e6f76ffc2c_o2/owners')


      const [owner] = data.data.owners.filter((owner: any) => {
        
        return owner.paymail === user?.paymail
      })

      console.log('OWNER', { owner, user })

      if (owner?.amount) {

        const amount = owner.amount / 100000000

        setTokenBalance(amount)

      } else {

      }


    })();


  }, [user])

  const handleLogin = async () => {

    console.log('HANDLE LOGIN')

    try {
            // @ts-ignore
            const token = await relayone.authBeta();

            console.log({token})

            const json = JSON.parse(atob(token.split('.')[0]));
            console.log({json})
            localStorage.setItem('powco.auth.type', 'relayx');
            localStorage.setItem('powco.auth.relayx.token', token);
            localStorage.setItem('powco.auth.relayx.auth', JSON.stringify(json));
            localStorage.setItem('powco.auth.relayx.paymail', json.paymail);
            localStorage.setItem('powco.auth.relayx.pubkey', json.pubkey);
            localStorage.setItem('powco.auth.relayx.origin', json.origin);
            localStorage.setItem('powco.auth.relayx.issued_at', json.issued_at);

            localStorage.setItem('userData', JSON.stringify(Object.assign(json, {
              email: json.paymail,
              role: 'relayx'
            })))
            localStorage.setItem('refreshToken', token)
            localStorage.setItem('accessToken', token)
      
            setUser(json)

            const routeOnLogin = localStorage.getItem('powco.auth.routeOnLogin')

            if (routeOnLogin) {

              localStorage.setItem('powco.auth.routeOnLogin', '/meet')

              router.replace(routeOnLogin)

            } else {

              router.replace('/meet')

            }
            

    } catch(error) {

      console.error('powco.auth.relayx.error', error)
    
    }

  }

  const handleLogout = () => {
    setUser(null)
    setIsInitialized(false)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin()
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    tokenBalance
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
