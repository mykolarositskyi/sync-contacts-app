import { render, screen } from '@testing-library/react'
import { StatsGrid } from '../stats-grid'

describe('StatsGrid', () => {
  const mockStats = [
    { value: '1,234', label: 'Total Users' },
    { value: '567', label: 'Active Users' },
    { value: '89%', label: 'Success Rate' }
  ]

  it('renders correctly with default props', () => {
    render(<StatsGrid stats={mockStats} />)
    
    expect(screen.getByText('1,234')).toBeInTheDocument()
    expect(screen.getByText('Total Users')).toBeInTheDocument()
  })

  it('renders all stats with correct values and labels', () => {
    render(<StatsGrid stats={mockStats} />)
    
    expect(screen.getByText('1,234')).toBeInTheDocument()
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('567')).toBeInTheDocument()
    expect(screen.getByText('Active Users')).toBeInTheDocument()
    expect(screen.getByText('89%')).toBeInTheDocument()
    expect(screen.getByText('Success Rate')).toBeInTheDocument()
  })

  it('uses default columns value of 3', () => {
    render(<StatsGrid stats={mockStats} />)
    
    const grid = document.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-3')
  })

  it('applies custom columns value', () => {
    render(<StatsGrid stats={mockStats} columns={4} />)
    
    const grid = document.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-4')
  })

  it('applies custom className', () => {
    const customClass = 'custom-stats-grid-class'
    render(<StatsGrid stats={mockStats} className={customClass} />)
    
    const grid = document.querySelector('.grid')
    expect(grid).toHaveClass(customClass)
  })

  it('renders with custom value colors', () => {
    const statsWithColors = [
      { value: '1,234', label: 'Total Users', valueColor: 'text-green-600' },
      { value: '567', label: 'Active Users', valueColor: 'text-blue-600' },
      { value: '89%', label: 'Success Rate', valueColor: 'text-purple-600' }
    ]
    
    render(<StatsGrid stats={statsWithColors} />)
    
    const totalUsersValue = screen.getByText('1,234')
    const activeUsersValue = screen.getByText('567')
    const successRateValue = screen.getByText('89%')
    
    expect(totalUsersValue).toHaveClass('text-green-600')
    expect(activeUsersValue).toHaveClass('text-blue-600')
    expect(successRateValue).toHaveClass('text-purple-600')
  })

  it('uses default value color when not specified', () => {
    render(<StatsGrid stats={mockStats} />)
    
    const value = screen.getByText('1,234')
    expect(value).toHaveClass('text-blue-600')
  })

  it('renders with single stat', () => {
    const singleStat = [{ value: '42', label: 'Answer to Everything' }]
    render(<StatsGrid stats={singleStat} />)
    
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('Answer to Everything')).toBeInTheDocument()
  })

  it('renders with empty stats array', () => {
    render(<StatsGrid stats={[]} />)
    
    const grid = document.querySelector('.grid')
    expect(grid).toBeInTheDocument()
  })

  it('renders with numeric values', () => {
    const numericStats = [
      { value: 1234, label: 'Numeric Value' },
      { value: 567.89, label: 'Decimal Value' }
    ]
    
    render(<StatsGrid stats={numericStats} />)
    
    expect(screen.getByText('1234')).toBeInTheDocument()
    expect(screen.getByText('567.89')).toBeInTheDocument()
  })

  it('has correct default styling classes', () => {
    render(<StatsGrid stats={mockStats} />)
    
    const grid = document.querySelector('.grid')
    expect(grid).toHaveClass('grid', 'gap-4', 'text-center')
  })

  it('combines default and custom classes', () => {
    const customClass = 'mt-8 mb-4'
    render(<StatsGrid stats={mockStats} className={customClass} />)
    
    const grid = document.querySelector('.grid')
    expect(grid).toHaveClass('grid', 'gap-4', 'text-center', 'mt-8', 'mb-4')
  })

  it('renders value with correct styling', () => {
    render(<StatsGrid stats={mockStats} />)
    
    const value = screen.getByText('1,234')
    expect(value).toHaveClass('text-2xl', 'font-bold')
  })

  it('renders label with correct styling', () => {
    render(<StatsGrid stats={mockStats} />)
    
    const label = screen.getByText('Total Users')
    expect(label).toHaveClass('text-sm', 'text-gray-500')
  })

  it('handles very long labels', () => {
    const longLabelStats = [
      { value: '42', label: 'This is a very long label that might wrap to multiple lines and should be handled gracefully by the component' }
    ]
    
    render(<StatsGrid stats={longLabelStats} />)
    
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('This is a very long label that might wrap to multiple lines and should be handled gracefully by the component')).toBeInTheDocument()
  })
})
