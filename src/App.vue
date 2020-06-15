<template>
<div class="h-100">
    <router-view />
    <color-switcher />
    <!--<cart />-->
</div>
</template>

<script>
import ColorSwitcher from "./components/Common/ColorSwitcher";
import Cart from "./components/Custom/Cart";
import {
    getDirection
} from "./utils";



export default {
    components: {
        "color-switcher": ColorSwitcher,
        //"cart": Cart
    },
    beforeMount() {
        const direction = getDirection();
        if (direction.isRtl) {
            document.body.classList.add("rtl");
            document.dir = "rtl";
            document.body.classList.remove("ltr");
        } else {
            document.body.classList.add("ltr");
            document.dir = "ltr";
            document.body.classList.remove("rtl");
        }
    },
    methods:{
        backButtonEvent() {
            if (this.platform.is('android')) {
                this.platform.backButton.subscribeWithPriority(0, () => {
                console.log('this.router.url', this.router.url);
                if (this.router.url === '/app' ) {
                    alert("saindo")
                    navigator['app'].exitApp();
                }  else {
                this.navCtrl.navigateBack('/' + 'componetToGo');
                }
            });
            }
        }
    }

};
</script>
