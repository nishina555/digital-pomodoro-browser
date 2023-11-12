# Digital Pomodoro Browser
A simple Pomodoro timer that repeats work and break sessions at regular intervals.

## Usage
Access `https://nishina555.github.io/digital-pomodoro-browser/pomodoro`, then the timer will be displayed.
You can modify the settings by adding query parameters.

## Appearance

### Default（Light Theme）

<p>
   <kbd><img width="370" alt="work_light" src="https://github.com/nishina555/digital-pomodoro-browser/assets/3121046/06540dbb-83c4-4b90-b2a1-1cc52be0aeb3"></kbd>
   <kbd><img width="370" alt="break_light" src="https://github.com/nishina555/digital-pomodoro-browser/assets/3121046/dc8dba1f-33e6-4db3-975d-4b951e32e60e"></kbd>
</p>
<p>
   <kbd><img width="370" alt="work_light_with_session" src="https://github.com/nishina555/digital-pomodoro-browser/assets/3121046/0f62dd81-036f-436c-80a2-16155da63ac3"></kbd>
   <kbd><img width="370" alt="break_light_with_session" src="https://github.com/nishina555/digital-pomodoro-browser/assets/3121046/416f79a7-c689-42c7-a8c7-b3636eb85cd8"></kbd>
</p>


### Dark Theme

<p>
   <kbd><img width="370" alt="work_dark" src="https://github.com/nishina555/digital-pomodoro-browser/assets/3121046/2df16ce9-98f7-4e37-a102-0fd2cfa9fe1a"></kbd>
   <kbd><img width="370" alt="break_dark" src="https://github.com/nishina555/digital-pomodoro-browser/assets/3121046/dd960041-e011-4d04-941f-3aee347300f0"></kbd>
</p>
<p>
   <kbd><img width="370" alt="work_dark_with_session" src="https://github.com/nishina555/digital-pomodoro-browser/assets/3121046/240d208d-bbd5-47b9-b0e5-e7e0031eada7"></kbd>
   <kbd><img width="370" alt="break_dark_with_session" src="https://github.com/nishina555/digital-pomodoro-browser/assets/3121046/8505bfa6-7c3e-4dca-a9fc-cf7eb100db8a"></kbd>
</p>

## Query Parameters

|Query|Description|Type|Default|
|:-|:-|:-|:-|
|work|Minutes of working time|number|25|
|break|Minutes of breaking time|number|5|
|startFrom|Hours and Minutes of starting working time|number|1000|
|theme|Themes of the timer|`light｜dark`|`light`|
|opacity|Opacity of background. The value can be set within the range of 0 to 1.|number|1|
|displaySession|Display current session(`work` or `break`). |`0｜1`|0|

## Example of Request

|URL|Meaning|
|:-|:-|
|`https://nishina555.github.io/digital-pomodoro-browser/pomodoro`|the work session is for 25 minutes. </br> the break session is for 5 minutes.</br> the timer adjusted to start the work session exactly from 10:00.|
|`https://nishina555.github.io/digital-pomodoro-browser/pomodoro?work=50&break=10&startFrom=1405`|the work session is for 50 minutes. </br> the break session is for 10 minutes.</br> the timer adjusted to start the work session exactly from 14:05 minutes.|
|`https://nishina555.github.io/digital-pomodoro-browser/pomodoro?displaySession=1`|the timer with displaying current session.|
|`https://nishina555.github.io/digital-pomodoro-browser/pomodoro?theme=dark&opacity=0.2`|the theme of the timer is dark. </br> the opacity of the background is 0.2|
