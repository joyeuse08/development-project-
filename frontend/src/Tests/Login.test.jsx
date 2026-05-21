
import { render, screen } from "@testing-library/react"

test("shows login button", () => {

   render(<button>Login</button>)

   expect(
      screen.getByText("Login")
   ).toBeInTheDocument()
})
