import { render, screen, fireEvent } from '@testing-library/react'
import TaskCard from '../components/TaskCard'

const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'A test description',
  status: 'pending',
  user: { id: 1, name: 'Akshay', email: 'a@a.com' },
}

describe('TaskCard Component', () => {
  test('renders task title and description', () => {
    render(<TaskCard task={mockTask} onEdit={jest.fn()} onDelete={jest.fn()} onToggle={jest.fn()} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('A test description')).toBeInTheDocument()
  })

  test('shows pending status badge', () => {
    render(<TaskCard task={mockTask} onEdit={jest.fn()} onDelete={jest.fn()} onToggle={jest.fn()} />)
    expect(screen.getByText('pending')).toBeInTheDocument()
  })

  test('calls onDelete when delete button clicked', () => {
    const onDelete = jest.fn()
    render(<TaskCard task={mockTask} onEdit={jest.fn()} onDelete={onDelete} onToggle={jest.fn()} />)
    fireEvent.click(screen.getByText('✕'))
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  test('calls onEdit when edit button clicked', () => {
    const onEdit = jest.fn()
    render(<TaskCard task={mockTask} onEdit={onEdit} onDelete={jest.fn()} onToggle={jest.fn()} />)
    fireEvent.click(screen.getByText('✎'))
    expect(onEdit).toHaveBeenCalledWith(mockTask)
  })
})