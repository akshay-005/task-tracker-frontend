import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Login from '../pages/Login'

jest.mock('../api/auth', () => ({ login: jest.fn() }))
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))

import { login } from '../api/auth'

const mockLoginUser = jest.fn()

const renderLogin = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ loginUser: mockLoginUser }}>
        <Login />
      </AuthContext.Provider>
    </MemoryRouter>
  )

describe('Login Page', () => {
  test('renders login form fields', () => {
    renderLogin()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  test('shows error when fields are empty', async () => {
    renderLogin()
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByText('All fields are required.')).toBeInTheDocument()
    })
  })

  test('calls login API with correct credentials', async () => {
    login.mockResolvedValueOnce({ data: { token: 'fake-token', user: { id: 1, name: 'Test' } } })
    renderLogin()
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'),         { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' })
    })
  })
})