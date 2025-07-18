import {Expense} from "@/types/index"


type TopExpTableProps = {
  expense: Expense[];
};

const TopExpTable = ({expense}: TopExpTableProps) => {


  return (

    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4 text-white">Your Top 5 Transactions</h2>
        <div className=" bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-lg">
          <table className="min-w-full text-left text-sm text-white/80">
              <thead className="bg-white/10 border-b border-white/10 uppercase">
                  <tr>
                      <th scope="col" className="px-6 py-4 font-medium text-purple-300">Title</th>
                      <th scope="col" className="px-6 py-4 font-medium text-purple-300">Category</th>
                      <th scope="col" className="px-6 py-4 font-medium text-purple-300">Date</th>
                      <th scope='col' className='px-6 py-4 font-medium text-purple-300 text-right rounded-tr-lg'>Amount</th>
                  </tr>
              </thead>
              <tbody>
                  {expense.slice(0, 5).map(exp => (
                    <tr className="hover:bg-white/5 transition" key={exp.id}>
                      <th scope="row" className="px-6 py-4  font-medium whitespace-nowrap">{exp.title}</th>
                      <td className="px-6 py-4">{exp.category}</td>
                      <td className="px-6 py-4">{exp.date}</td>
                      <td className="px-6 py-4 text-right text-white">{exp.amount.toLocaleString('en-IN')}</td>
                  </tr>
                  ))}
              </tbody>
          </table>
        </div>
    </div>  
    
  )
}

export default TopExpTable
