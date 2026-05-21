import { render, screen } from "@testing-library/react"

function Dashboard() {
   return <h1>Dashboard</h1>
}

test("renders dashboard", () => {

   render(<Dashboard />)

   expect(
      screen.getByText("Dashboard")
   ).toBeInTheDocument()
})
