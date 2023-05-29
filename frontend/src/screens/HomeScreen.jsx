
import Hero from "../components/Hero"
import { useSelector } from "react-redux"
const HomeScreen = () => {
  const { userInfo } = useSelector(state=>state.auth)

  return (
    <div>
        {userInfo ? <h1>Hi! {userInfo.name}</h1> : <Hero />}
    </div>
  )
}

export default HomeScreen