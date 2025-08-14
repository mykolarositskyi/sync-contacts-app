import { render, screen } from '@testing-library/react'
import { SettingsSectionHeader } from '../settings-section-header'
import { User, Settings, Zap } from 'lucide-react'

describe('SettingsSectionHeader', () => {
  const defaultProps = {
    icon: User,
    title: 'Section Title',
    description: 'Section description text',
    iconBgColor: 'bg-blue-500',
    iconColor: 'text-white'
  }

  it('renders correctly with default props', () => {
    render(<SettingsSectionHeader {...defaultProps} />)
    
    expect(screen.getByText('Section Title')).toBeInTheDocument()
    expect(screen.getByText('Section description text')).toBeInTheDocument()
  })

  it('renders with correct title and description', () => {
    render(<SettingsSectionHeader {...defaultProps} />)
    
    expect(screen.getByText('Section Title')).toBeInTheDocument()
    expect(screen.getByText('Section description text')).toBeInTheDocument()
  })

  it('renders icon correctly', () => {
    render(<SettingsSectionHeader {...defaultProps} />)
    
    // Find icon by looking for SVG with the expected classes
    const icon = document.querySelector('svg.lucide-user')
    expect(icon).toBeInTheDocument()
  })

  it('applies correct icon styling', () => {
    render(<SettingsSectionHeader {...defaultProps} />)
    
    // Find icon container by looking for div with the expected classes
    const iconContainer = document.querySelector('div.bg-blue-500.rounded-lg')
    expect(iconContainer).toBeInTheDocument()
    
    // Find icon by looking for SVG with the expected classes
    const icon = document.querySelector('svg.lucide-user')
    expect(icon).toHaveClass('text-white')
  })

  it('renders with showHeaderOnly=true', () => {
    render(<SettingsSectionHeader {...defaultProps} showHeaderOnly={true} />)
    
    // Find the header container by looking for div with the expected classes
    const header = document.querySelector('div.flex.items-center.gap-3')
    expect(header).toBeInTheDocument()
  })

  it('renders with showHeaderOnly=false (default)', () => {
    render(<SettingsSectionHeader {...defaultProps} showHeaderOnly={false} />)
    
    // Find the main container by looking for div with the expected classes
    const header = document.querySelector('div.space-y-4')
    expect(header).toBeInTheDocument()
  })

  it('renders children when showHeaderOnly is false', () => {
    const children = <button data-testid="action-button">Action</button>
    render(
      <SettingsSectionHeader {...defaultProps} showHeaderOnly={false}>
        {children}
      </SettingsSectionHeader>
    )
    
    expect(screen.getByTestId('action-button')).toBeInTheDocument()
  })

  it('does not render children when showHeaderOnly is true', () => {
    const children = <button data-testid="action-button">Action</button>
    render(
      <SettingsSectionHeader {...defaultProps} showHeaderOnly={true}>
        {children}
      </SettingsSectionHeader>
    )
    
    expect(screen.queryByTestId('action-button')).not.toBeInTheDocument()
  })

  it('renders with different icons', () => {
    const { rerender } = render(<SettingsSectionHeader {...defaultProps} icon={Settings} />)
    const settingsIcon = document.querySelector('svg.lucide-settings')
    expect(settingsIcon).toBeInTheDocument()
    
    rerender(<SettingsSectionHeader {...defaultProps} icon={Zap} />)
    const zapIcon = document.querySelector('svg.lucide-zap')
    expect(zapIcon).toBeInTheDocument()
  })

  it('applies custom icon background and text colors', () => {
    const customProps = {
      ...defaultProps,
      iconBgColor: 'bg-green-600',
      iconColor: 'text-yellow-300'
    }
    
    render(<SettingsSectionHeader {...customProps} />)
    
    const iconContainer = document.querySelector('div.bg-green-600.rounded-lg')
    expect(iconContainer).toBeInTheDocument()
    
    const icon = document.querySelector('svg.lucide-user')
    expect(icon).toHaveClass('text-yellow-300')
  })

  it('has correct icon container styling', () => {
    render(<SettingsSectionHeader {...defaultProps} />)
    
    const iconContainer = document.querySelector('div.p-2.rounded-lg')
    expect(iconContainer).toBeInTheDocument()
  })

  it('has correct icon dimensions', () => {
    render(<SettingsSectionHeader {...defaultProps} />)
    
    const icon = document.querySelector('svg.lucide-user')
    expect(icon).toHaveClass('h-5', 'w-5')
  })

  it('has correct title styling', () => {
    render(<SettingsSectionHeader {...defaultProps} />)
    
    const title = screen.getByText('Section Title')
    expect(title).toHaveClass('text-base', 'font-semibold', 'text-gray-900')
  })

  it('has correct description styling', () => {
    render(<SettingsSectionHeader {...defaultProps} />)
    
    const description = screen.getByText('Section description text')
    expect(description).toHaveClass('text-sm', 'text-gray-500')
  })

  it('renders with long title and description', () => {
    const longProps = {
      ...defaultProps,
      title: 'This is a very long section title that might wrap to multiple lines',
      description: 'This is a very long description that contains a lot of text and might also wrap to multiple lines to test the component\'s ability to handle longer content gracefully.'
    }
    
    render(<SettingsSectionHeader {...longProps} />)
    
    expect(screen.getByText(longProps.title)).toBeInTheDocument()
    expect(screen.getByText(longProps.description)).toBeInTheDocument()
  })

  it('renders with empty title and description', () => {
    const emptyProps = {
      ...defaultProps,
      title: '',
      description: ''
    }
    
    render(<SettingsSectionHeader {...emptyProps} />)
    
    // Find the main container by looking for div with the expected classes
    const header = document.querySelector('div.space-y-4')
    expect(header).toBeInTheDocument()
  })

  it('has correct layout classes for header only mode', () => {
    render(<SettingsSectionHeader {...defaultProps} showHeaderOnly={true} />)
    
    // Find the header container by looking for div with the expected classes
    const header = document.querySelector('div.flex.items-center.gap-3')
    expect(header).toBeInTheDocument()
  })

  it('has correct layout classes for full mode', () => {
    render(<SettingsSectionHeader {...defaultProps} showHeaderOnly={false} />)
    
    // Find the main container by looking for div with the expected classes
    const header = document.querySelector('div.space-y-4')
    expect(header).toBeInTheDocument()
  })

  it('renders multiple children correctly', () => {
    const children = (
      <>
        <button data-testid="button1">Button 1</button>
        <button data-testid="button2">Button 2</button>
        <span data-testid="text">Additional text</span>
      </>
    )
    
    render(
      <SettingsSectionHeader {...defaultProps} showHeaderOnly={false}>
        {children}
      </SettingsSectionHeader>
    )
    
    expect(screen.getByTestId('button1')).toBeInTheDocument()
    expect(screen.getByTestId('button2')).toBeInTheDocument()
    expect(screen.getByTestId('text')).toBeInTheDocument()
  })
})
