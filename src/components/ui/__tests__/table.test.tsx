import { render, screen } from '@testing-library/react'
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableFooter, 
  TableRow, 
  TableHead, 
  TableCell, 
  TableCaption 
} from '../table'

describe('Table Integration', () => {
  it('renders a complete table structure', () => {
    render(
      <Table data-testid="table">
        <TableCaption data-testid="caption">Test Table</TableCaption>
        <TableHeader data-testid="thead">
          <TableRow data-testid="header-row">
            <TableHead data-testid="header-cell">Name</TableHead>
            <TableHead data-testid="header-cell-2">Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody data-testid="tbody">
          <TableRow data-testid="body-row">
            <TableCell data-testid="body-cell">John Doe</TableCell>
            <TableCell data-testid="body-cell-2">john@example.com</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter data-testid="tfoot">
          <TableRow data-testid="footer-row">
            <TableCell data-testid="footer-cell">Total: 1</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )

    expect(screen.getByTestId('table')).toBeInTheDocument()
    expect(screen.getByTestId('caption')).toBeInTheDocument()
    expect(screen.getByTestId('thead')).toBeInTheDocument()
    expect(screen.getByTestId('tbody')).toBeInTheDocument()
    expect(screen.getByTestId('tfoot')).toBeInTheDocument()
    
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
  })

  it('forwards refs correctly', () => {
    const tableRef = jest.fn()
    const theadRef = jest.fn()
    const tbodyRef = jest.fn()
    
    render(
      <Table ref={tableRef} data-testid="table">
        <TableHeader ref={theadRef} data-testid="thead" />
        <TableBody ref={tbodyRef} data-testid="tbody" />
      </Table>
    )
    
    expect(tableRef).toHaveBeenCalled()
    expect(theadRef).toHaveBeenCalled()
    expect(tbodyRef).toHaveBeenCalled()
  })

  it('applies custom className to table', () => {
    const customClass = 'custom-table-class'
    render(
      <Table className={customClass} data-testid="table">
        <TableBody>
          <TableRow>
            <TableCell>Test</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    
    const table = screen.getByTestId('table')
    expect(table).toHaveClass(customClass)
  })

  it('renders table with proper structure', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Data')).toBeInTheDocument()
  })
})
