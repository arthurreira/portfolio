import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@arthurreira/ui"
import { WeatherMiniCardProps } from './weatherMiniCardProps'


export function WeatherMiniCard({ city, temperature, windSpeed, emoji, description, label }: WeatherMiniCardProps) {
    return (
        <>
        <Card className="p-4 "  >
            <CardHeader className="p-0 mb-3">
                <div className='flex flex-row justify-between gap-6'>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
                   <CardTitle className="text-xs font-extrabold truncate max-w-[120px] ">{city}</CardTitle>

                </div>
            </CardHeader>
            <CardContent className="p-0 ">
                <div className="flex flex-row justify-between items-end">
                    <p className="text-3xl font-bold">{temperature}°</p>
                    <p className="text-4xl">{emoji}</p>
                </div>
                
            </CardContent>
            <div className="p-0 mt-3">
                <div className="flex flex-row justify-between mt-2">
                    <p className="text-sm text-muted-foreground">{description}</p>
                    <p className="text-sm text-muted-foreground">💨 {windSpeed} km/h</p>
                </div>
            </div>
        </Card>
        </>

    )
}