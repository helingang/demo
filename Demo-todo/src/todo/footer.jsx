import '../assets/css/footer.css'

export default {
    data(){
        return {
            time: '4.3'
        }
    },
    render(){
        return (
            <div id="footer">
                <span>{ this.time }</span>
            </div>
        )
    }
}