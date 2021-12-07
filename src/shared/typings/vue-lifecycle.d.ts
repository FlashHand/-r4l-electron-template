import VueRouter from 'vue-router'
declare module 'vue/types/vue' {
    export interface Vue {
        beforeCreate(): void
        created(): void
        beforeMount(): void
        mounted(): void
        beforeUpdate(): void
        updated(): void
        activated(): void
        deactivated(): void
        beforeDestroy(): void
        destroyed(): void
        $router: VueRouter
        $error: (e: any, wrapMsg?: string) => void
    }

}


