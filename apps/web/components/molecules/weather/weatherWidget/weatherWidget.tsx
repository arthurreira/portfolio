import { WeatherMiniCard } from '../../../atoms/weather'
import { WeatherWidgetProps } from './weatherWidgetProps'


export async function WeatherWidget({ labelFrom, labelLive }: WeatherWidgetProps) {
  const [from, live] = await Promise.all([
    fetch('https://weather.arthurreira.dev/api/weather?city=vila%20xurupita%20(vila%20nova%20mg)').then(r => r.json()),
    fetch('https://weather.arthurreira.dev/api/weather?city=kuopio').then(r => r.json()),
  ])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <WeatherMiniCard {...from} label={labelFrom} />
      <WeatherMiniCard {...live} label={labelLive} />
    </div>
  )
}