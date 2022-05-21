class InputBar {
    // 构造属性，帮到对应的div
    constructor() {
        this.inputEle = document.querySelector('input')
        this.btnBox = document.querySelector('.input-buttons')
    }
    // 初始化函数
    init() {
        // 让操作出现
        this.inputEle.addEventListener('focus', (e) => {
            this.btnBox.style.opacity = 1
        })
        // 让操作隐藏
        this.inputEle.addEventListener('blur', (e) => {
            // this.inputEle.classList.remove('input-focus')
            this.btnBox.style.opacity = 0
        })

    }
}
const InputBarInstance = new InputBar();
InputBarInstance.init()

// 删除盒子内的卡片，保证所有的卡片都是通过JS新建，
const templeCard = document.querySelector('.todo-card')
templeCard.remove()

class ToDoCard {
    constructor(card) {
        // 获取父节点
        this.cardContainer = document.querySelector('.todo-card-container')
        // 深度克隆
        this.card = card.cloneNode(true)
        this.editBlock = this.card.querySelector('.edit-block')
        // 和双击唤起卡片input有关系
        this.clickTimeID = 0;
        this.clickCount = 0;
        // 唤起iconbar
        this.fourIcons = this.card.querySelector('.four-icons').children
        this.doneIcon = this.card.querySelector('.icon-box-done-init')

        // 更换颜色
        this.colorBoard = this.card.querySelector('.color-board')
        // 最喜欢状态
        this.stateCard = {
            isFav: false
        }
        // 删除卡片
        this.deleteId = 0

        this.init()
    }
    appendCard() {
        // 往父节点里面加入卡片
        this.cardContainer.appendChild(this.card)
    }
    deleteCard(){
        // this.card.remove()
        // this.card.style.width = '0px'
        // this.card.style.paddingLeft = '0px'
        // this.card.style.paddingRight = '0px'
        // this.card.style.opacity = 0
        // this.card.style.marginRight = '0px'
        // this.iconsBar.style.display = 'none'
        // this.textSpan.style.opacity = 0
    
        
    
        setTimeout(() =>{
          this.card.remove()
        //   this.updataNum()
        },400)
      }
    init() {
        this.appendCard()
        // 实现双击？
        this.card.addEventListener("mosedown", (e) => {
            //阻止默认行为
            e.preventDefault()
            e.stopPropagation()
            //  ??? 双击速度要够快就唤起输入状态
            clearTimeout(this.clickTimeId)
            this.clickCount++
            if (this.clickCount === 2) {
                console.log(this.clickCount)
                this.editBlock.focus()
            }
            this.clickTimeID = setTimeout(() => {
                this.clickCount = 0;
            }, 200)
        })
        // ??? 便编辑区域光标设置？
        this.editBlock.addEventListener('focus', (e) => {
            const selection = getSelection()
            const range = selection.getRangeAt(0)
            const textNode = this.editBlock.childNodes[0]
            range.setStart(textNode, textNode.length)
        })
        // 鼠标移入卡片区域 图标出现
        this.card.addEventListener('mouseenter', (e) => {
            const fourIconsArr = [...this.fourIcons]

            fourIconsArr.forEach((icon) => {
                icon.classList.remove('icon-init')
                icon.firstElementChild.classList.remove('svg-init')
            })
            this.doneIcon.classList.remove('icon-box-done-init')
            this.doneIcon.firstElementChild.classList.remove('svg-done-init')
        })
        // iconbar 消失

        this.card.addEventListener("mouseleave", (e) => {
            const fourIconsArr = [...this.fourIcons]
            fourIconsArr.forEach((icon, index) => {
                if (this.stateCard.isFav && index === 3) {

                } else {
                    icon.classList.add('icon-init')
                    icon.firstElementChild.classList.add('svg-init')
                }

            })
            this.doneIcon.classList.add('icon-box-done-init')
            this.doneIcon.firstElementChild.classList.add('svg-done-init')

            // 鼠标移出card清除颜色呼出的设置
            setTimeout(() => {
                this.colorBoard.classList.add('color-init')
            }, 300)

        })

        // 点击色点实现卡片颜色切换
        this.colorBoard.addEventListener("click", (e) => {
            // console.log(e.target.className,e.target.nodeName)

            if (e.target.nodeName === "SPAN") {
                const colorClass = e.target.className
                const basicClass = this.card.className.split(' ')[0]
                this.card.className = basicClass + ' ' + colorClass

            }

        })
        // 点击调色板按钮 实现调色板出现的切换
        this.fourIcons[1].addEventListener('click', (e) => {
            this.colorBoard.classList.toggle('color-init')
        })

        // 点击重点图标 然后图标固定 变颜色
        this.fourIcons[3].addEventListener("click", (e) => {
            this.stateCard.isFav = !this.stateCard.isFav
            e.currentTarget.children[0].children[1].style.fill = this.stateCard.isFav ? "#edce46" : "white"
            e.currentTarget.children[0].children[0].style.fill = this.stateCard.isFav ? "white" : "black"

        })
        // 删除icon
        this.fourIcons[0].addEventListener("mousedown", (e) => {
            //获取的是删除icon的svg的circle 部分 
            const target = e.currentTarget.children[1].firstElementChild

            // 配合css部分的transition产生了边框动效，svg的stroke 用了dash 和dashoff都为一个满值
            target.style.strokeDashoffset = '0'
            // 这个拿到了该svg对象多有的样式class名....
            const styles = getComputedStyle(target)

            // 获取要删除的卡片的id
            this.deleteId = setInterval(() => {
                if (parseInt(styles.strokeDashoffset) === 0) {

                      this.deleteCard()
                      clearInterval( this.deleteId)

                }
            }, 100)

        })
        this.fourIcons[0].addEventListener("mouseup", (e) => {
            const target = e.currentTarget.children[1].firstElementChild
            const styles = getComputedStyle(target)

            // 如果删除过程中鼠标挪开，那又缩回去
            if (parseInt(styles.strokeDashoffset) > 0) {
                // clearInterval(this.deleteId)
                target.style.strokeDashoffset = '88'
            }
        })

    }

}
const card1 = new ToDoCard(templeCard)
const card2 = new ToDoCard(templeCard)
const card3 = new ToDoCard(templeCard)


