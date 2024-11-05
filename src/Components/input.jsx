

export default function input({
    type,
    placeholder,
    className = '',
    value,
    onChange}) {
  return (
    <div>
        <input type={type} placeholder={placeholder} className={className('w-full px-4 py-2 pr-10 border text-sm rounded-md outline-none')} value={value} onChange={onChange}/>
    </div>
  )
}
