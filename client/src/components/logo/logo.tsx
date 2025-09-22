import { PROTECTED_ROUTES } from "@/routes/common/routePath"
import { Link } from "react-router-dom"

const Logo = (props: { url?: string }) => {
  return (
    <Link to={props.url || PROTECTED_ROUTES.OVERVIEW} className="flex items-center gap-2">
    <div className="bg-yellow-500 text-white h-6.5 w-6.5 rounded flex items-center justify-center font-bold text-sm">
    ₹
    </div>
    <span className="font-semibold text-lg">BudgetBuddy</span>
  </Link>
  )
}

export default Logo