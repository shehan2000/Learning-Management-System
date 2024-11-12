import UserCard from "@/components/UserCard"

const AdminPage = () => {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      {/*LEFT SIDE*/}
      <div className='w-full lg:w-2/3'>
      {/*USER CARDS*/}
      <div className='flex gap-4 justify-between'>
        <UserCard type='Students' />
        <UserCard type='Teachers' />
        <UserCard type='Parents' />
        <UserCard type='Staffs' />
        </div>
      </div>
      {/*RIGHT SIDE*/}
      <div className='w-full lg:w-1/3'>r</div>
    </div>
  )
}

export default AdminPage;