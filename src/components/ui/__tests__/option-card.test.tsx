import { render, screen, fireEvent } from '@testing-library/react'
import { OptionCard } from '../option-card'

describe('OptionCard', () => {
  const defaultProps = {
    label: 'Option Label',
    description: 'Option description text',
    icon: '🚀',
    isSelected: false,
    onClick: jest.fn(),
    selectedBorderColor: 'border-blue-500',
    selectedBgColor: 'bg-blue-50',
    hoverBorderColor: 'border-gray-300',
    hoverBgColor: 'bg-gray-50'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with default props', () => {
    render(<OptionCard {...defaultProps} />)
    
    expect(screen.getByText('Option Label')).toBeInTheDocument()
    expect(screen.getByText('Option description text')).toBeInTheDocument()
  })

  it('renders with correct label and description', () => {
    render(<OptionCard {...defaultProps} />)
    
    expect(screen.getByText('Option Label')).toBeInTheDocument()
    expect(screen.getByText('Option description text')).toBeInTheDocument()
  })

  it('renders icon correctly', () => {
    render(<OptionCard {...defaultProps} />)
    
    expect(screen.getByText('🚀')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    render(<OptionCard {...defaultProps} />)
    
    // Find the main card element by looking for the container with the main card classes
    const card = document.querySelector('div[class*="p-4"][class*="border"][class*="rounded-lg"]')
    fireEvent.click(card!)
    
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1)
  })

  it('applies selected styling when isSelected is true', () => {
    render(<OptionCard {...defaultProps} isSelected={true} />)
    
    // Find the main card element by looking for the container with the main card classes
    const card = document.querySelector('div[class*="p-4"][class*="border"][class*="rounded-lg"]')
    expect(card).toHaveClass('border-blue-500', 'bg-blue-50', 'shadow-md')
  })

  it('applies default styling when isSelected is false', () => {
    render(<OptionCard {...defaultProps} isSelected={false} />)
    
    // Find the main card element by looking for the container with the main card classes
    const card = document.querySelector('div[class*="p-4"][class*="border"][class*="rounded-lg"]')
    expect(card).toHaveClass('border-gray-200')
  })

  it('has correct default classes', () => {
    render(<OptionCard {...defaultProps} />)
    
    // Find the main card element by looking for the container with the main card classes
    const card = document.querySelector('div[class*="p-4"][class*="border"][class*="rounded-lg"]')
    expect(card).toHaveClass('p-4', 'border', 'rounded-lg', 'cursor-pointer', 'transition-all', 'duration-200')
  })

  it('renders with different icons', () => {
    const { rerender } = render(<OptionCard {...defaultProps} icon="⭐" />)
    expect(screen.getByText('⭐')).toBeInTheDocument()
    
    rerender(<OptionCard {...defaultProps} icon="🎯" />)
    expect(screen.getByText('🎯')).toBeInTheDocument()
  })

  it('applies custom selected colors', () => {
    const customProps = {
      ...defaultProps,
      selectedBorderColor: 'border-green-500',
      selectedBgColor: 'bg-green-50'
    }
    
    render(<OptionCard {...customProps} isSelected={true} />)
    
    // Find the main card element by looking for the container with the main card classes
    const card = document.querySelector('div[class*="p-4"][class*="border"][class*="rounded-lg"]')
    expect(card).toHaveClass('border-green-500', 'bg-green-50')
  })

  it('applies custom hover colors', () => {
    const customProps = {
      ...defaultProps,
      hoverBorderColor: 'border-purple-300',
      hoverBgColor: 'bg-purple-50'
    }
    
    render(<OptionCard {...customProps} />)
    
    // Find the main card element by looking for the container with the main card classes
    const card = document.querySelector('div[class*="p-4"][class*="border"][class*="rounded-lg"]')
    expect(card).toHaveClass('hover:border-purple-300', 'hover:bg-purple-50')
  })

  it('renders with long label and description', () => {
    const longProps = {
      ...defaultProps,
      label: 'This is a very long option label that might wrap to multiple lines',
      description: 'This is a very long description that contains a lot of text and might also wrap to multiple lines to test the component\'s ability to handle longer content gracefully.'
    }
    
    render(<OptionCard {...longProps} />)
    
    expect(screen.getByText(longProps.label)).toBeInTheDocument()
    expect(screen.getByText(longProps.description)).toBeInTheDocument()
  })

  it('has correct icon and label layout', () => {
    render(<OptionCard {...defaultProps} />)
    
    const iconLabelContainer = screen.getByText('🚀').closest('div')
    expect(iconLabelContainer).toHaveClass('flex', 'items-center', 'gap-2', 'mb-2')
  })

  it('has correct icon styling', () => {
    render(<OptionCard {...defaultProps} />)
    
    const icon = screen.getByText('🚀')
    expect(icon).toHaveClass('text-lg')
  })

  it('has correct label styling', () => {
    render(<OptionCard {...defaultProps} />)
    
    const label = screen.getByText('Option Label')
    expect(label).toHaveClass('font-medium', 'text-gray-900')
  })

  it('has correct description styling', () => {
    render(<OptionCard {...defaultProps} />)
    
    const description = screen.getByText('Option description text')
    expect(description).toHaveClass('text-sm', 'text-gray-600')
  })

  it('handles multiple clicks', () => {
    render(<OptionCard {...defaultProps} />)
    
    // Find the main card element by looking for the container with the main card classes
    const card = document.querySelector('div[class*="p-4"][class*="border"][class*="rounded-lg"]')
    fireEvent.click(card!)
    fireEvent.click(card!)
    fireEvent.click(card!)
    
    expect(defaultProps.onClick).toHaveBeenCalledTimes(3)
  })

  it('renders with empty label and description', () => {
    const emptyProps = {
      ...defaultProps,
      label: '',
      description: ''
    }
    
    render(<OptionCard {...emptyProps} />)
    
    // Find the main card element by looking for the container with the main card classes
    const card = document.querySelector('div[class*="p-4"][class*="border"][class*="rounded-lg"]')
    expect(card).toBeInTheDocument()
  })

  it('applies hover effects', () => {
    render(<OptionCard {...defaultProps} />)
    
    // Find the main card element by looking for the container with the main card classes
    const card = document.querySelector('div[class*="p-4"][class*="border"][class*="rounded-lg"]')
    expect(card).toHaveClass('hover:shadow-sm')
  })

  it('has correct cursor style', () => {
    render(<OptionCard {...defaultProps} />)
    
    // Find the main card element by looking for the container with the main card classes
    const card = document.querySelector('div[class*="p-4"][class*="border"][class*="rounded-lg"]')
    expect(card).toHaveClass('cursor-pointer')
  })
})
