import { render, screen } from '@testing-library/react'
import { FormField } from '../form-field'

describe('FormField', () => {
  it('renders correctly with required props', () => {
    render(
      <FormField label="Email Address">
        <input type="email" data-testid="input" />
      </FormField>
    )
    
    const label = screen.getByText('Email Address')
    const input = screen.getByTestId('input')
    
    expect(label).toBeInTheDocument()
    expect(input).toBeInTheDocument()
  })

  it('renders label with correct text', () => {
    const labelText = 'Password'
    render(
      <FormField label={labelText}>
        <input type="password" />
      </FormField>
    )
    
    expect(screen.getByText(labelText)).toBeInTheDocument()
  })

  it('associates label with input using htmlFor', () => {
    const inputId = 'email-input'
    render(
      <FormField label="Email" htmlFor={inputId}>
        <input id={inputId} type="email" data-testid="input" />
      </FormField>
    )
    
    const label = screen.getByText('Email')
    const input = screen.getByTestId('input')
    
    expect(label).toHaveAttribute('for', inputId)
    expect(input).toHaveAttribute('id', inputId)
  })

  it('applies custom className', () => {
    const customClass = 'custom-form-field-class'
    render(
      <FormField 
        label="Test Label" 
        className={customClass}
      >
        <input type="text" />
      </FormField>
    )
    
    const formField = screen.getByText('Test Label').closest('div')
    expect(formField).toHaveClass(customClass)
  })

  it('renders children correctly', () => {
    const childText = 'Custom Input Component'
    render(
      <FormField label="Test Label">
        <div data-testid="custom-child">{childText}</div>
      </FormField>
    )
    
    const customChild = screen.getByTestId('custom-child')
    expect(customChild).toBeInTheDocument()
    expect(customChild).toHaveTextContent(childText)
  })

  it('renders multiple children', () => {
    render(
      <FormField label="Test Label">
        <input type="text" data-testid="input1" />
        <input type="email" data-testid="input2" />
        <span data-testid="helper-text">Helper text</span>
      </FormField>
    )
    
    expect(screen.getByTestId('input1')).toBeInTheDocument()
    expect(screen.getByTestId('input2')).toBeInTheDocument()
    expect(screen.getByTestId('helper-text')).toBeInTheDocument()
  })

  it('has correct default label styling', () => {
    render(
      <FormField label="Test Label">
        <input type="text" />
      </FormField>
    )
    
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')
  })

  it('handles empty label', () => {
    render(
      <FormField label="">
        <input type="text" />
      </FormField>
    )
    
    const formField = screen.getByRole('textbox')
    expect(formField).toBeInTheDocument()
  })

  it('handles complex children components', () => {
    const ComplexChild = () => (
      <div data-testid="complex-child">
        <input type="text" placeholder="Enter text" />
        <button type="button">Submit</button>
      </div>
    )
    
    render(
      <FormField label="Complex Field">
        <ComplexChild />
      </FormField>
    )
    
    const complexChild = screen.getByTestId('complex-child')
    expect(complexChild).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })
})
